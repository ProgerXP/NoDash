<?php
$gen->chemdocConfig()->customInsets['FunctionIndex'] = function ($formatter, $token) {
  if (!($formatter instanceof Chemdoc\Formatters\HTML)) {
    throw new Exception("$token->name: unsupported formatter ".get_class($formatter));
  }

  $lines = explode("\n", $token->textContent(''));
  $header = [];
  $functions = [];  // index in $header => hash
  $aliases = [];

  foreach ($lines as $i => $line) {
    $line = trim($line);
    $parts = array_map('trim', explode('|', $line));

    if ($line === '') {
      continue;
    } elseif (!$i) {
      $header = [];
      foreach ($parts as $i => $part) {
        $header[] = $i
          ? ['url' => strtok($part, ' '), 'title' => strtok(null)]
          : ['url' => '', 'title' => $part];
      }
    } else {
      $columns = $defined = [];

      foreach ($parts as $col => $part) {
        if ($part === '') {
          $columns[] = null;
        } elseif (!preg_match('/^((\d+\s+)*)(\S+)(\s*->\s*(.+))?$()/u', $part, $match)) {
          throw new Exception("$token->name: cannot parse line: $line");
        } else {
          list(, $footnotes, , $name, , $aliasedTo) = $match;
          $footnotes = $footnotes ? preg_split('/\s+/u', trim($footnotes)) : [];
          $defined[] = $columns[] = compact('footnotes', 'name', 'aliasedTo');
          $ref = &$aliases[$col][$aliasedTo] or $ref = [];
          $ref[] = $name;
        }
      }

      foreach ($columns as $i => &$ref) {
        $ref and $ref['diffName'] = $ref['name'] !== $defined[0]['name'];
      }

      $functions[] = $columns;
    }
  }

  usort($functions, function ($a, $b) {
    while (!$a[0]) { array_shift($a); }
    while (!$b[0]) { array_shift($b); }
    return strcasecmp($a[0]['name'], $b[0]['name']);
  });

  $entities = new Chem\EntityList;
  $entities->unserialize(json_decode(file_get_contents('docs/entities.json')));
  $output = new Chem\HtmlOutput;
  $urlOf = new ReflectionMethod($output, 'urlOf');
  $urlOf->setAccessible(true);

  $esc = 'htmlspecialchars';
  ob_start();
?>
<style>
  .func-idx { table-layout: fixed; width: 100%; border-collapse: collapse; }
  .func-idx thead { background: #e1e1e1; }
  .func-idx tr > * { border: 1px solid #c0c0c0; }
  .func-idx_ok { background: #efe; }
  .func-idx_miss { background: #fee; color: #faa; }
</style>

<p>Green cells mark functions supported by NoDash and by one of the other libraries.</p>

<table class="func-idx">
  <thead>
    <tr>
      <?php foreach ($header as $i => $column) {?>
        <th>
          <?php if ($column['url']) {?>
            <a href="<?=$esc($column['url'])?>" target="_blank">
          <?php }?>
          <?=$esc($column['title']), $column['url'] ? '</a>' : ''?>
          (<a href="#" onclick="funcIdx.toggleSupportedIn(<?=$i?>); return false" title="Hide functions supported only by <?=$esc($column['title'])?>">T</a>)
        </th>
      <?php }?>
    </tr>
  </thead>
  <tbody>
    <?php foreach ($functions as $cols) {?>
      <tr>
        <?php foreach ($cols as $i => $col) {?>
          <?php if ($col) {?>
            <td class="<?=($cols[0] and count(array_filter($cols)) > 1) ? 'func-idx_ok' : ''?>">
              <?php if (strrchr($header[$i]['url'], '#')) {?>
                <a href="<?=$esc($header[$i]['url'].$col['name'])?>" target="_blank">
              <?php } else if (!$header[$i]['url']) {?>
                <a href="<?=$esc($urlOf->invoke($output, $entities->find(['name' => $col['name']])[0]))?>">
              <?php }?>
              <?=$esc($col['name'])?></a>
              <?php if ($col['aliasedTo']) {?>
                (alias of <?=$esc($col['aliasedTo'])?>)
              <?php }?>
              <?php if (isset($aliases[$i][$col['name']])) {?>
                (<abbr title="<?=$esc(join(', ', $aliases[$i][$col['name']]))?>">aliases</abbr>)
              <?php }?>
              <?php if ($col['diffName']) {?>
                <b>diff. name</b>
              <?php }?>
              <?php foreach ($col['footnotes'] as $note) {?>
                [<a href="#-footnote<?=$note?>" id="footnoteuse<?=$note?>"><?=$note?></a>]
              <?php }?>
          <?php } else {?>
            <td class="func-idx_miss">
              missing
          <?php }?>
          </td>
        <?php }?>
      </tr>
    <?php }?>
  </tbody>
</table>

<script>
  var funcIdx = {
    _data: <?=json_encode($functions, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)?>,
    _columnStates: <?=json_encode(array_fill(0, count($header), []), JSON_FORCE_OBJECT)?>,
    el: document.querySelector('.func-idx'),

    toggleSupportedIn: function (col) {
      var nodes = this.el.querySelectorAll('tbody tr')
      this._columnStates[col].hiddenUnsupported = !this._columnStates[col].hiddenUnsupported

      nodes.forEach(function (node, index) {
        var vis = this._data[index].some(function (func, i) {
          return !this._columnStates[i].hiddenUnsupported && !!func
        }, this)
        node.style.display = vis ? '' : 'none'
      }, this)
    },
  }
</script>

<?php
  return ob_get_clean();
};